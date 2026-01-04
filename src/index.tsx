import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'

type Bindings = {
  DB: D1Database;
}

type Property = {
  id?: number;
  title: string;
  description: string;
  type: string;
  transaction_type: string;
  price: number;
  area: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  city: string;
  postal_code: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  features?: string;
  year_built?: number;
  available?: boolean;
  created_at?: string;
  updated_at?: string;
}

type Inquiry = {
  id?: number;
  property_id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status?: string;
  created_at?: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS pour les appels API
app.use('/api/*', cors())

// Servir les fichiers statiques
app.use('/static/*', serveStatic({ root: './public' }))

// ============================================
// API ROUTES - PROPERTIES
// ============================================

// GET /api/properties - Liste toutes les propriétés
app.get('/api/properties', async (c) => {
  const { DB } = c.env
  
  // Récupérer les paramètres de recherche
  const type = c.req.query('type')
  const transaction = c.req.query('transaction')
  const city = c.req.query('city')
  const minPrice = c.req.query('minPrice')
  const maxPrice = c.req.query('maxPrice')
  const minArea = c.req.query('minArea')

  let query = 'SELECT * FROM properties WHERE available = 1'
  const params: any[] = []

  if (type) {
    query += ' AND type = ?'
    params.push(type)
  }
  if (transaction) {
    query += ' AND transaction_type = ?'
    params.push(transaction)
  }
  if (city) {
    query += ' AND city LIKE ?'
    params.push(`%${city}%`)
  }
  if (minPrice) {
    query += ' AND price >= ?'
    params.push(Number(minPrice))
  }
  if (maxPrice) {
    query += ' AND price <= ?'
    params.push(Number(maxPrice))
  }
  if (minArea) {
    query += ' AND area >= ?'
    params.push(Number(minArea))
  }

  query += ' ORDER BY created_at DESC'

  const { results } = await DB.prepare(query).bind(...params).all()
  
  return c.json({ success: true, properties: results })
})

// GET /api/properties/:id - Détails d'une propriété
app.get('/api/properties/:id', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')

  const property = await DB.prepare('SELECT * FROM properties WHERE id = ?')
    .bind(id)
    .first()

  if (!property) {
    return c.json({ success: false, message: 'Propriété non trouvée' }, 404)
  }

  return c.json({ success: true, property })
})

// POST /api/properties - Créer une nouvelle propriété
app.post('/api/properties', async (c) => {
  const { DB } = c.env
  const data: Property = await c.req.json()

  const result = await DB.prepare(`
    INSERT INTO properties (
      title, description, type, transaction_type, price, area, 
      rooms, bedrooms, bathrooms, address, city, postal_code,
      country, latitude, longitude, image_url, features, year_built
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.title,
    data.description,
    data.type,
    data.transaction_type,
    data.price,
    data.area,
    data.rooms || null,
    data.bedrooms || null,
    data.bathrooms || null,
    data.address,
    data.city,
    data.postal_code,
    data.country || 'France',
    data.latitude || null,
    data.longitude || null,
    data.image_url || null,
    data.features || null,
    data.year_built || null
  ).run()

  return c.json({ 
    success: true, 
    message: 'Propriété créée avec succès',
    id: result.meta.last_row_id 
  }, 201)
})

// PUT /api/properties/:id - Mettre à jour une propriété
app.put('/api/properties/:id', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  const data: Property = await c.req.json()

  const result = await DB.prepare(`
    UPDATE properties SET
      title = ?, description = ?, type = ?, transaction_type = ?,
      price = ?, area = ?, rooms = ?, bedrooms = ?, bathrooms = ?,
      address = ?, city = ?, postal_code = ?, country = ?,
      latitude = ?, longitude = ?, image_url = ?, features = ?,
      year_built = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    data.title,
    data.description,
    data.type,
    data.transaction_type,
    data.price,
    data.area,
    data.rooms || null,
    data.bedrooms || null,
    data.bathrooms || null,
    data.address,
    data.city,
    data.postal_code,
    data.country || 'France',
    data.latitude || null,
    data.longitude || null,
    data.image_url || null,
    data.features || null,
    data.year_built || null,
    id
  ).run()

  if (result.meta.changes === 0) {
    return c.json({ success: false, message: 'Propriété non trouvée' }, 404)
  }

  return c.json({ success: true, message: 'Propriété mise à jour avec succès' })
})

// DELETE /api/properties/:id - Supprimer une propriété
app.delete('/api/properties/:id', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')

  const result = await DB.prepare('DELETE FROM properties WHERE id = ?')
    .bind(id)
    .run()

  if (result.meta.changes === 0) {
    return c.json({ success: false, message: 'Propriété non trouvée' }, 404)
  }

  return c.json({ success: true, message: 'Propriété supprimée avec succès' })
})

// ============================================
// API ROUTES - INQUIRIES
// ============================================

// POST /api/inquiries - Créer une demande de renseignements
app.post('/api/inquiries', async (c) => {
  const { DB } = c.env
  const data: Inquiry = await c.req.json()

  const result = await DB.prepare(`
    INSERT INTO inquiries (property_id, name, email, phone, message)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    data.property_id,
    data.name,
    data.email,
    data.phone || null,
    data.message
  ).run()

  return c.json({ 
    success: true, 
    message: 'Demande envoyée avec succès',
    id: result.meta.last_row_id 
  }, 201)
})

// GET /api/inquiries - Liste toutes les demandes
app.get('/api/inquiries', async (c) => {
  const { DB } = c.env
  const status = c.req.query('status')

  let query = `
    SELECT i.*, p.title as property_title 
    FROM inquiries i 
    LEFT JOIN properties p ON i.property_id = p.id
  `
  
  if (status) {
    query += ' WHERE i.status = ?'
    const { results } = await DB.prepare(query).bind(status).all()
    return c.json({ success: true, inquiries: results })
  }

  query += ' ORDER BY i.created_at DESC'
  const { results } = await DB.prepare(query).all()
  
  return c.json({ success: true, inquiries: results })
})

// ============================================
// FRONTEND ROUTE
// ============================================
app.use(renderer)

app.get('/', (c) => {
  return c.render(
    <div>
      <div id="root"></div>
    </div>
  )
})

export default app

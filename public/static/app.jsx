const { useState, useEffect } = React;

// Composant principal
function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    transaction: '',
    city: '',
    minPrice: '',
    maxPrice: ''
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);

  // Charger les propriétés
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.transaction) params.append('transaction', filters.transaction);
      if (filters.city) params.append('city', filters.city);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await axios.get(`/api/properties?${params.toString()}`);
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Erreur lors du chargement des propriétés:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      transaction: '',
      city: '',
      minPrice: '',
      maxPrice: ''
    });
    setTimeout(() => fetchProperties(), 100);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const parseFeatures = (featuresStr) => {
    if (!featuresStr) return [];
    try {
      return JSON.parse(featuresStr);
    } catch {
      return [];
    }
  };

  const featureLabels = {
    parking: 'Parking',
    balcon: 'Balcon',
    ascenseur: 'Ascenseur',
    cave: 'Cave',
    double_vitrage: 'Double vitrage',
    cuisine_equipee: 'Cuisine équipée',
    piscine: 'Piscine',
    jardin: 'Jardin',
    garage: 'Garage',
    terrasse: 'Terrasse',
    climatisation: 'Climatisation',
    cheminee: 'Cheminée',
    meuble: 'Meublé',
    fibre_optique: 'Fibre optique',
    alarme: 'Alarme',
    volets_electriques: 'Volets électriques',
    neuf: 'Neuf',
    interphone: 'Interphone',
    digicode: 'Digicode',
    acces_handicape: 'Accès handicapé',
    poutres_apparentes: 'Poutres apparentes',
    grande_hauteur: 'Grande hauteur',
    lumineux: 'Lumineux',
    vue_mer: 'Vue mer'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-home text-4xl"></i>
              <div>
                <h1 className="text-3xl font-bold">ImmoApp</h1>
                <p className="text-blue-100 text-sm">Trouvez votre bien idéal</p>
              </div>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#" className="hover:text-blue-200 transition"><i className="fas fa-search mr-2"></i>Rechercher</a>
              <a href="#" className="hover:text-blue-200 transition"><i className="fas fa-heart mr-2"></i>Favoris</a>
              <a href="#" className="hover:text-blue-200 transition"><i className="fas fa-user mr-2"></i>Mon compte</a>
            </div>
          </div>
        </div>
      </header>

      {/* Filtres de recherche */}
      <div className="bg-white shadow-md border-b">
        <div className="container mx-auto px-4 py-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                <option value="appartement">Appartement</option>
                <option value="maison">Maison</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
                <option value="bureau">Bureau</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction</label>
              <select
                value={filters.transaction}
                onChange={(e) => setFilters({...filters, transaction: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Vente et Location</option>
                <option value="vente">Vente</option>
                <option value="location">Location</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                placeholder="Paris, Lyon..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix min</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix max</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                placeholder="∞"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <i className="fas fa-search mr-2"></i>Chercher
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                title="Réinitialiser"
              >
                <i className="fas fa-redo"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Liste des propriétés */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {properties.length} bien{properties.length > 1 ? 's' : ''} disponible{properties.length > 1 ? 's' : ''}
              </h2>
              <div className="flex space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <i className="fas fa-th-large mr-2"></i>Grille
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <i className="fas fa-list mr-2"></i>Liste
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  formatPrice={formatPrice}
                  parseFeatures={parseFeatures}
                  featureLabels={featureLabels}
                  onViewDetails={() => setSelectedProperty(property)}
                  onContact={() => {
                    setSelectedProperty(property);
                    setShowContactForm(true);
                  }}
                />
              ))}
            </div>

            {properties.length === 0 && (
              <div className="text-center py-20">
                <i className="fas fa-home text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune propriété trouvée</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal détails */}
      {selectedProperty && !showContactForm && (
        <PropertyModal
          property={selectedProperty}
          formatPrice={formatPrice}
          parseFeatures={parseFeatures}
          featureLabels={featureLabels}
          onClose={() => setSelectedProperty(null)}
          onContact={() => setShowContactForm(true)}
        />
      )}

      {/* Formulaire de contact */}
      {showContactForm && selectedProperty && (
        <ContactForm
          property={selectedProperty}
          onClose={() => {
            setShowContactForm(false);
            setSelectedProperty(null);
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ImmoApp</h3>
              <p className="text-gray-400">Votre partenaire immobilier de confiance pour trouver le bien idéal.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">À propos</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Mentions légales</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><i className="fas fa-phone mr-2"></i>01 23 45 67 89</li>
                <li><i className="fas fa-envelope mr-2"></i>contact@immoapp.fr</li>
                <li><i className="fas fa-map-marker-alt mr-2"></i>Paris, France</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 ImmoApp. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Composant carte propriété
function PropertyCard({ property, formatPrice, parseFeatures, featureLabels, onViewDetails, onContact }) {
  const features = parseFeatures(property.features);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={property.image_url || 'https://via.placeholder.com/400x300?text=Pas+d\'image'}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {property.transaction_type === 'vente' ? 'Vente' : 'Location'}
        </div>
        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded-full text-sm font-semibold">
          {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{property.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <i className="fas fa-map-marker-alt mr-2 text-blue-600"></i>
          <span className="text-sm">{property.city}, {property.postal_code}</span>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <i className="fas fa-ruler-combined mr-1 text-blue-600"></i>
            <span>{property.area} m²</span>
          </div>
          {property.rooms && (
            <div className="flex items-center">
              <i className="fas fa-door-open mr-1 text-blue-600"></i>
              <span>{property.rooms} pièces</span>
            </div>
          )}
          {property.bedrooms && (
            <div className="flex items-center">
              <i className="fas fa-bed mr-1 text-blue-600"></i>
              <span>{property.bedrooms} ch.</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {features.slice(0, 3).map((feature, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {featureLabels[feature] || feature}
            </span>
          ))}
          {features.length > 3 && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              +{features.length - 3}
            </span>
          )}
        </div>

        <div className="border-t pt-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(property.price)}
              {property.transaction_type === 'location' && <span className="text-sm text-gray-600">/mois</span>}
            </div>
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            onClick={onViewDetails}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <i className="fas fa-eye mr-2"></i>Détails
          </button>
          <button
            onClick={onContact}
            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            <i className="fas fa-envelope mr-2"></i>Contact
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal détails propriété
function PropertyModal({ property, formatPrice, parseFeatures, featureLabels, onClose, onContact }) {
  const features = parseFeatures(property.features);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <img
            src={property.image_url || 'https://via.placeholder.com/800x400?text=Pas+d\'image'}
            alt={property.title}
            className="w-full h-96 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <i className="fas fa-times text-gray-600"></i>
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h2>
              <div className="flex items-center text-gray-600">
                <i className="fas fa-map-marker-alt mr-2 text-blue-600"></i>
                <span>{property.address}, {property.city} {property.postal_code}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(property.price)}
                {property.transaction_type === 'location' && <span className="text-lg text-gray-600">/mois</span>}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {property.transaction_type === 'vente' ? 'À vendre' : 'À louer'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <i className="fas fa-ruler-combined text-2xl text-blue-600 mb-2"></i>
              <div className="font-semibold">{property.area} m²</div>
              <div className="text-sm text-gray-600">Surface</div>
            </div>
            {property.rooms && (
              <div className="text-center">
                <i className="fas fa-door-open text-2xl text-blue-600 mb-2"></i>
                <div className="font-semibold">{property.rooms} pièces</div>
                <div className="text-sm text-gray-600">Pièces</div>
              </div>
            )}
            {property.bedrooms && (
              <div className="text-center">
                <i className="fas fa-bed text-2xl text-blue-600 mb-2"></i>
                <div className="font-semibold">{property.bedrooms}</div>
                <div className="text-sm text-gray-600">Chambres</div>
              </div>
            )}
            {property.bathrooms && (
              <div className="text-center">
                <i className="fas fa-bath text-2xl text-blue-600 mb-2"></i>
                <div className="font-semibold">{property.bathrooms}</div>
                <div className="text-sm text-gray-600">Salles de bain</div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Équipements et caractéristiques</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-gray-700">
                    <i className="fas fa-check text-green-600"></i>
                    <span>{featureLabels[feature] || feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {property.year_built && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Informations complémentaires</h3>
              <div className="text-gray-700">
                <i className="fas fa-calendar mr-2 text-blue-600"></i>
                Année de construction : {property.year_built}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={onContact}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium text-lg"
            >
              <i className="fas fa-envelope mr-2"></i>Demander des informations
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Formulaire de contact
function ContactForm({ property, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Bonjour,\n\nJe suis intéressé(e) par le bien "${property.title}" à ${property.city}.\n\nPouvez-vous me fournir plus d'informations ?\n\nMerci.`
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/inquiries', {
        property_id: property.id,
        ...formData
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Demande d'informations</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-start space-x-4">
              <img
                src={property.image_url || 'https://via.placeholder.com/100'}
                alt={property.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{property.title}</h3>
                <p className="text-sm text-gray-600">{property.city}, {property.postal_code}</p>
              </div>
            </div>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <i className="fas fa-check-circle text-5xl text-green-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Message envoyé !</h3>
              <p className="text-green-700">Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="jean.dupont@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre message..."
                ></textarea>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>Envoi en cours...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>Envoyer
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Rendu de l'application
ReactDOM.render(<App />, document.getElementById('root'));

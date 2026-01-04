import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ImmoApp - Votre plateforme immobilière</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
        <script>
          {`
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: '#2563eb',
                    secondary: '#7c3aed'
                  }
                }
              }
            }
          `}
        </script>
      </head>
      <body className="bg-gray-50">
        {children}
        <script crossOrigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script crossOrigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script type="text/babel" src="/static/app.jsx"></script>
      </body>
    </html>
  )
})

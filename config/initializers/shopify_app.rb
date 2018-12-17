ShopifyApp.configure do |config|
  config.application_name = "My Shopify App"
  config.api_key = "1ea8943856bd8b6900d3a9e9442cd8b9"
  config.secret = "0900d8743f3cc6055b8f3b01c9292224"
  config.scope = "read_products" # Consult this page for more scope options:
                                 # https://help.shopify.com/en/api/getting-started/authentication/oauth/scopes
  config.embedded_app = true
  config.after_authenticate_job = false
  config.session_repository = ShopifyApp::InMemorySessionStore
end

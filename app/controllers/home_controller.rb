class HomeController < ShopifyApp::AuthenticatedController

  # def variants
  #   ShopifyAPI::Variant.find(:all, params: { limit: 10 })
  # end

  def index
    @products = ShopifyAPI::Product.find(:all, params: { limit: 10 })
    # @webhooks = ShopifyAPI::Webhook.find(:all)
  end
end

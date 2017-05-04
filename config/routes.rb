Rails.application.routes.draw do
  devise_for :users

  namespace :admin do
  	resources :members do
      collection do
        get 'check_in'
        put 'save_uid'
      end
    end
  end

  root to: 'admin/members#index'
end

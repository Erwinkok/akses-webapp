Rails.application.routes.draw do
  devise_for :users

  namespace :admin do
  	resources :members do
      collection do
        get 'check_in'
        get 'check_out'
      end
    end
  end

  root to: 'admin/members#index'
end

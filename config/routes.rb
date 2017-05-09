Rails.application.routes.draw do
  devise_for :users

  namespace :admin do
  	resources :members do
      collection do
        get 'check_in'
        # put 'save_uid'
        # put 'save_space_id'
      end
    end
  end

  root to: 'admin/members#index'
end

Rails.application.routes.draw do
  devise_for :users
  
  namespace :admin do
  	resources :members
  end

  root to: 'admin/members#index'


end

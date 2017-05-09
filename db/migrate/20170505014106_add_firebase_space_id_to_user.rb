class AddFirebaseSpaceIdToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :firebase_spaceId, :string
  end
end

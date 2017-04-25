class CreateMembers < ActiveRecord::Migration[5.0]
  def change
    create_table :members do |t|
      t.string :memberId
      t.string :name
      t.string :email

      t.timestamps
    end
  end
end

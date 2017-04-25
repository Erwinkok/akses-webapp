class CreateVisits < ActiveRecord::Migration[5.0]
  def change
    create_table :visits do |t|
      t.integer :beginAt, :limit => 8
      t.integer :endAt, :limit => 8
      t.references :memberId
      t.references :spaceId

      t.timestamps
    end
  end
end

class CreateArchitects < ActiveRecord::Migration
  def change
    create_table :architects do |t|
      t.string :name
      t.string :country
      t.timestamps null: false
    end
  end
end

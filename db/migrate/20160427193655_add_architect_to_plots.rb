class AddArchitectToPlots < ActiveRecord::Migration
  def change
    add_reference :plots, :architect, index: true, foreign_key: true
  end
end

class RenameUsersToPlots < ActiveRecord::Migration
  def change
  	rename_table :users, :plots
  end
end

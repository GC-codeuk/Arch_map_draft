class AddImgLinkToUsers < ActiveRecord::Migration
  def change
    add_column :users, :img_link, :string
  end
end

class AddOmniauthToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :provider, :string
    add_column :users, :uid, :string
    add_column :users, :nickname, :string
    add_column :users, :image, :text
    add_column :users, :token, :string
    add_column :users, :refresh_token, :string
    add_column :users, :string, :string
  end
end

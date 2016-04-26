json.array!(@plots) do |plot|
  json.extract! plot, :id, :latitude, :longitude, :address, :description, :title
  json.url plot_url(plot, format: :json)
end

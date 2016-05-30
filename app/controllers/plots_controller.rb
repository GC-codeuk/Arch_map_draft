class PlotsController < ApplicationController
  before_action :set_plot, only: [:show, :edit, :update, :destroy]

  # GET /plots
  # GET /plots.json
  def index
    @plots = Plot.all
    @hash = Gmaps4rails.build_markers(@plots) do |plot, marker|
      marker.lat plot.latitude
      marker.lng plot.longitude
      marker.title plot.title
      marker.infowindow render_to_string(:partial => "/plots/infobox.html.erb", :locals => { :plot => plot})
      marker.picture({
       "url" => "https://db.tt/j97PY6WG",
       "width" =>  32,
       "height" => 32})
      marker.json({ title: plot.title })

    end
  end

  def map
    @plots = Plot.all
    @hash = Gmaps4rails.build_markers(@plots) do |plot, marker|
      marker.lat plot.latitude
      marker.lng plot.longitude
      marker.title plot.title
      marker.infowindow render_to_string(:partial => "/plots/infobox.html.erb", :locals => { :plot => plot})
      marker.picture({
       "url" => "https://db.tt/j97PY6WG",
       "width" =>  32,
       "height" => 32})
      marker.json({ title: plot.title })
    end
  end


  # GET /plots/1
  # GET /plots/1.json
  def show
  end

  # GET /plots/new
  def new
    @plot = Plot.new
  end

  # GET /plots/1/edit
  def edit
  end

  # POST /plots
  # POST /plots.json
  def create
    @plot = Plot.new(plot_params)

    respond_to do |format|
      if @plot.save
        format.html { redirect_to @plot, notice: 'Plot was successfully created.' }
        format.json { render :show, status: :created, location: @plot }
      else
        format.html { render :new }
        format.json { render json: @plot.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /plots/1
  # PATCH/PUT /plots/1.json
  def update
    respond_to do |format|
      if @plot.update(plot_params)
        format.html { redirect_to @plot, notice: 'Plot was successfully updated.' }
        format.json { render :show, status: :ok, location: @plot }
      else
        format.html { render :edit }
        format.json { render json: @plot.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /plots/1
  # DELETE /plots/1.json
  def destroy
    @plot.destroy
    respond_to do |format|
      format.html { redirect_to plots_url, notice: 'Plot was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  # GET /plots/1/plotdetails
  def plotdetails
    @plot = Plot.find(params[:id])
    respond_to do |format|
      format.js { render :layout => false }
    end
  end

  def buildings
    @plots = Plot.all
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_plot
      @plot = Plot.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def plot_params
      params.require(:plot).permit(:latitude, :longitude, :address, :description, :title, :typ, :img_link, :architect_id)
    end
end

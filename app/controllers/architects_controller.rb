class ArchitectsController < ApplicationController
  before_action :set_architect, only: [:show, :edit, :update, :destroy]
  
  # GET /architects
  # GET /architects.json
  def index
  	@architects = Architect.all
  end

  # GET /architects/new
  def new
    @architect = Architect.new
  end

  # GET /architects/1
  # GET /architects/1.json
  def show
  	@architect = Architect.find(params[:id])
  	#@plots = @architect.plots
  end

  # GET /architects/1/edit
  def edit
  end

  # POST /architects
  # POST /architects.json
  def create
    @architect = Architect.new(architect_params)

    respond_to do |format|
      if @architect.save
        format.html { redirect_to @architect, notice: 'Architect was successfully created.' }
        format.json { render :show, status: :created, location: @architect }
      else
        format.html { render :new }
        format.json { render json: @architect.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /architects/1
  # PATCH/PUT /architects/1.json
  def update
    respond_to do |format|
      if @architect.update(architect_params)
        format.html { redirect_to @architect, notice: 'Plot was successfully updated.' }
        format.json { render :show, status: :ok, location: @architect }
      else
        format.html { render :edit }
        format.json { render json: @architect.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /architects/1
  # DELETE /architects/1.json
  def destroy
    @architect.destroy
    respond_to do |format|
      format.html { redirect_to architects_url, notice: 'Plot was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
	# Use callbacks to share common setup or constraints between actions.
	def set_architect
	  @architect = Architect.find(params[:id])
	end

	# Never trust parameters from the scary internet, only allow the white list through.
	def architect_params
	  params.require(:architect).permit(:name, :country)
  end
end

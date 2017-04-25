class Admin::MembersController < ApplicationController
	before_action :authenticate_user!
	before_action :set_member, only: [:show, :edit, :update, :destroy]

	layout 'member'

	def index
		@members = Admin::Member.all.order('created_at DESC')
	end

	def show

	end

	def edit
	end

	def update
		respond_to do |format|
			if @member.update(member_params)
				format.html { redirect_to admin_member_path(@member), notice: 'Member was successfully updated' }
			else
				format.html { render :edit }
			end
		end
	end

	def new
		@member = Admin::Member.new
	end

	def create
		@member = Admin::Member.new(member_params)

	    respond_to do |format|
	      if @member.save
	        format.html { redirect_to admin_member_path(@member), notice: 'Member was successfully created.' }
	      else
	        format.html { render :new }
	      end
	    end
	end

	def destroy
		respond_to do |format|
			if @member.destroy
				format.html {redirect_to admin_members_path, notice: 'Member successfully destroyed'}	
			else
				format.html { render :show }
			end
		end
	end


	private

	def set_member
      @member = Admin::Member.find(params[:id])
    end

    def member_params
		params.require(:admin_member).permit(:name, :email)
    end

end
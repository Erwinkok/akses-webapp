class Admin::MembersController < ApplicationController
	before_action :authenticate_user!
	before_action :set_member, only: [:edit, :update, :destroy]

	layout 'member'

	# def save_uid
	# 	user = User.where(:email => params[:email])
	# 	respond_to do |format|
	# 		if user[0].update_attribute(:firebase_uid, params[:uid])
	# 			format.html {}
	# 		end
	# 	end
	# end

	# def save_space_id
	# 	render params[:email].inspect
	# 	user = User.where(:email => params[:email])
	# 	if user.firebase_spaceId != params['spaceId']
	# 		respond_to do |format|
	# 			if user[0].update_attribute(:firebase_spaceId, params['spaceId'])
	# 				format.html {}
	# 			end
	# 		end
	# 	end
	# end

	def index
		if current_user
			me = current_user
			@members = Admin::Member.where(:spaceId => me.firebase_spaceId)
		end

		#@members = Admin::Member.all.order('created_at DESC')
	end

	def show
		#@memberid = params[:id]
	end

	def check_in

	end

	def check_out

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

		if Admin::Member.where(:email => @member.email).count == 0
			respond_to do |format|
				if @member.save
					format.html { }
				else
					format.html { render :new }
				end
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
			params.permit(:memberId, :name, :email, :spaceId)
    end

end

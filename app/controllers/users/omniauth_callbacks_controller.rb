class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
    # twitch callback
    def twitch
        @user = User.from_omniauth(request.env['omniauth.auth'])
        if @user.persisted?
            sign_in(@user)
            redirect_to '/streamer'
        else
            flash[:error] = 'There was a problem signing you in through Twitch. Please register or try signing in later.'
            redirect_to new_user_registration_url
        end 
    end

    def failure
        redirect_to root_path
    end 

end

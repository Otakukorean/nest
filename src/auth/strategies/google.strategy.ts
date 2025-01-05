import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-google-oauth20';
import { UsersService } from "src/users/users.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){
    constructor(private readonly usersService: UsersService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/api/auth/google/callback',
            passReqToCallback: true,
            scope: ['email', 'profile'],
        });
    }
    async validate(_accessToken: string, _refreshToken: string, profile: any) {
        return this.usersService.getOrCreateUser({
            email: profile.emails[0]?.value,
            password: null,
            username: profile.displayName,
            image: profile.photos[0]?.value,
          });
    }
}


// GOOGLE_CLIENT_ID=954328909253-gmico7g8v0jogvm1grq2khq6ctisqrev.apps.googleusercontent.com
// GOOGLE_CLIENT_SECRET=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
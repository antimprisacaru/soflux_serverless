import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import SocialAccountDto from '../dto/social-account.dto';
import { SocialAccountService } from '../services/social-account.service';
import { SocialPlatform } from '../../../shared/models/social-platform.model';
import { UserToken } from '../../../common/auth/decorators/user-token.decorator';

@Resolver('SocialAccount')
export class SocialAccountResolver {
    constructor(private readonly socialAccountService: SocialAccountService) {}

    @Mutation(() => Boolean, { nullable: true })
    async saveAccount(
        @UserToken() accessToken: string,
        @Args('code') code: string,
        @Args('platform') platform: string,
        @Args('redirect') redirect: string
    ): Promise<void> {
        if (!Object.values(SocialPlatform).find(x => x === platform)) {
          throw new Error(`Invalid social platform!`);
        }
        await this.socialAccountService.exchangeAndFetch(accessToken, code, platform as SocialPlatform, redirect);
    }

    @Query(() => [SocialAccountDto])
    async loadSocialAccounts(@UserToken() accessToken: string): Promise<SocialAccountDto[]> {
        return await this.socialAccountService.fetchAccounts(accessToken);
    }
}

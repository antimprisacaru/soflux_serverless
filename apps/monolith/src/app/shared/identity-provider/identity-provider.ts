import { GcpIdentityProvider } from './gcp-identity-provider';
import { AwsIdentityProvider } from './aws-identity-provider';
import { ConfigService } from '@nestjs/config';

export interface IdentityProvider {
    getUser(accessToken: string): Promise<string>;
    login(email: string, password: string): Promise<string>;
    signUp(username: string, password: string): Promise<void>;
    setPassword(id: string | number, password: string): Promise<void>;
    removeAll(): Promise<void>;
}

export const IdentityProviderFactory = {
    provide: 'IdentityProvider',
    useFactory: (configService: ConfigService) => {
        switch (configService.get<string>('provider')) {
            case 'aws':
                return new AwsIdentityProvider(configService);
            case 'gcp':
                return new GcpIdentityProvider(configService);
            default:
                throw new Error(`No Identity Provider found corresponding to input given.`);
        }
    },
    inject: [ConfigService]
};

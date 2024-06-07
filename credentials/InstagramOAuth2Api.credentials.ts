import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class InstagramLogin implements ICredentialType {
	name = 'instagramLogin';
	displayName = 'Instagram Login';
	documentationUrl = 'https://developers.facebook.com/docs/instagram';
	properties: INodeProperties[] = [
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			default: '',
		},
	];
}
import { 
    INodeType, 
    INodeTypeDescription, 
    INodeExecutionData, 
    NodeOperationError, 
    IExecuteFunctions } from 'n8n-workflow';
import { IgApiClient } from 'instagram-private-api';
import { get } from 'request-promise';

export class InstagramNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Instagram',
        name: 'instagram',
        group: ['social'],
        version: 1,
        description: 'Post to Instagram',
        defaults: {
            name: 'Instagram',
            color: '#1da1f2',
        },
        credentials: [
            {
                name: 'instagramLogin',
                required: true,
            },
        ],
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Image URL',
                name: 'imageUrl',
                type: 'string',
                default: '',
                description: 'The URL of the image to post.',
            },
            {
                displayName: 'Caption',
                name: 'caption',
                type: 'string',
                default: '',
                description: 'The caption for the post.',
            }
        ],
    };
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
    
        for (let i = 0; i < items.length; i++) {
            try {
                const imageUrl = this.getNodeParameter('imageUrl', i) as string;
                const caption = this.getNodeParameter('caption', i, '') as string;
                const credentials = await this.getCredentials('instagramLogin') as any;
    
                const ig = new IgApiClient();
                ig.state.generateDevice(credentials.username);
                await ig.account.login(credentials.username, credentials.password);
    
                const imageBuffer = await get({
                    url: imageUrl,
                    encoding: null, 
                });
    
                const response = await ig.publish.photo({
                    file: imageBuffer,
                    caption: caption,
                });
    
                // Convert the response to a plain JavaScript object
                const responseJson = { ...response };
                //const responseJson = response.toJSON ? response.toJSON() : { ...response };
    
                returnData.push({ json: responseJson });
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: this.getInputData(i)[0].json, error, pairedItem: i });
                } else {
                    throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
                }
            }
        }
    
        return this.prepareOutputData(returnData);
    }
}
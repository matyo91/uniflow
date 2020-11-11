import { Container as DIContainer, ObjectType } from "typedi"
import { MailchimpLeadSubscriber, MockedLeadSubscriber } from "./service/lead-subscriber"
import { NodeMailer, MockedMailer } from "./service/mailer"
import { AxiosRequest, MockedRequest } from "./service/request"

export default class Container {
    static init: boolean = false
    static get<T>(type: ObjectType<T>): T {
        if(!this.init) {
            const env = process.env.NODE_ENV || 'development'
            DIContainer.set('env', env)
    
            if(env === 'test') {
                DIContainer.set('RequestInterface', DIContainer.get(MockedRequest))
                DIContainer.set('MailerInterface', DIContainer.get(MockedMailer))
                DIContainer.set('LeadSubscriberInterface', DIContainer.get(MockedLeadSubscriber))
            } else {
                DIContainer.set('RequestInterface', DIContainer.get(AxiosRequest))
                DIContainer.set('MailerInterface', DIContainer.get(NodeMailer))
                DIContainer.set('LeadSubscriberInterface', DIContainer.get(MailchimpLeadSubscriber))
            }
            
            this.init = true
        }

        return DIContainer.get(type)
    }
}
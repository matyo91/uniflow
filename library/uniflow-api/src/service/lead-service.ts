import { Service } from 'typedi';
import { LeadEntity } from '../entity';

@Service()
export default class LeadService {
  public async isValid(lead: LeadEntity): Promise<boolean> {
    return true
  }
  
  public async getJson(lead: LeadEntity): Promise<Object> {
    return {
      email: lead.email,
      optinNewsletter: lead.optinNewsletter,
      optinBlog: lead.optinBlog,
    }
  }
}

# -*- coding: utf-8 -*-

from odoo import api, fields, models
import time

class ResPartner(models.Model):
    _inherit = 'res.partner'


    @api.model
    def test_orm(self,name):
        print("test_orm",self)
        partners = self.env['res.partner'].search([["name","ilike",name]], limit=100)

        lines=[]
        for partner in partners:
            lines.append({"id":partner.id, "name":partner.name})
        print(lines)

        return lines
    
# >>> self.search_read([], ['name'])

    @api.model
    def test_memoize_action(self):
        partners = self.env['res.partner'].search_read(domain=[],fields=["id","name"],order="name", limit=100)
        print("test_memoize_action",self,partners)


        time.sleep(2) # Sleep for 3 seconds



#   all_accounts = self.search_read(
#             domain=[('company_id', 'in', accounts_to_process.company_id.ids)],
#             fields=['code', 'account_type', 'company_id'],
#             order='code',
#         )


        # partners=[]
        # for line in lines:
        #     partners.append()

        # print(partners)

        res={
            "partners": partners,
            "test"    : "toto et tutu",
        }
        return res


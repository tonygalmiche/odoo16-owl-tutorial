# -*- coding: utf-8 -*-

from odoo import api, fields, models


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
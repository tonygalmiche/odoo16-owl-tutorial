# -*- coding: utf-8 -*-

from odoo import models,fields,api


class is_mem_var(models.Model):
    _name='is.mem.var'
    _description="Mem Var"
    _order='user_id,name'

    name     = fields.Char('Variable', required=True)
    login_ip = fields.Char('Login / IP', help="Permet de remplacer la table cookies de MySQL")
    user_id  = fields.Many2one('res.users', 'Utilisateur', required=True)
    valeur   = fields.Char('Valeur')


    def get(self,user_id,variable):
        valeur=False
        mem_vars=self.env['is.mem.var'].search([['user_id', '=', user_id],['name', '=', variable]])
        for mem_var in mem_vars:
            valeur=mem_var.valeur
        return valeur


    def set(self,user_id,variable,valeur):
        mem_vars=self.env['is.mem.var'].search([['user_id', '=', user_id],['name', '=', variable]])
        if len(mem_vars):
            for mem_var in mem_vars:
                mem_var.write({'valeur': valeur})
        else:
            mem_var=self.env['is.mem.var'].create({'valeur': valeur,'user_id':user_id,'name':variable})


# -*- coding: utf-8 -*-
from odoo import api, fields, models
from datetime import datetime, timedelta, date
from random import randint



class ProjectProject(models.Model):
    _inherit = 'project.project'


    @api.model
    def get_gantt_lines(self):
        data=[]
        links=[]
        link_id=1
        projects = self.env['project.project'].search([], limit=1000)
        for project in projects:
            project_id = project.id*100000
            data.append({
                "id": project_id, 
                "text": project.name, 
                "start_date":  False, 
                "duration": False, 
                "parent":0, 
                "progress": 0, 
                "open": True,
            })
            tasks = self.env['project.task'].search([("project_id","=",project.id)], limit=1000)
            for task in tasks:
                #print(task.depend_on_ids)
                for line in task.depend_on_ids:
                    print(line, line.id, task.id)
                    links.append({
                        "id": link_id,
                        "source": line.id,
                        "target": task.id,
                        "type": "0",
                    })
                    link_id+=1


        # var links=[];
        # for (let i = 2; i <= 5; i++) {
        #     links.push({id:i, source:i, target:i+1, type:"0"});
        # }



                duration = task.planned_hours or 8
                #start_date = datetime.now() + timedelta(hours=duration)
                end_date = task.date_deadline or datetime.now() 
                #progress = randint(0,100)/100
                progress = task.progress/100

                #start_date = datetime.now.strftime("%Y-%m-%d") #("%m/%d/%Y, %H:%M:%S")

                data.append({
                    "id": task.id, 
                    "text": task.name, 
                    "end_date":  end_date.strftime("%Y-%m-%d %H:%M"), 
                    #"start_date":  start_date.strftime("%Y-%m-%d %H:%M"), 
                    #"start_date":  start_date.date(), 
                    "duration": duration, 
                    "parent":project_id, 
                    "progress": progress, 
                    "open": True,
                })


        #lines=[]
        # for partner in partners:
        #     lines.append({"id":partner.id, "name":partner.name})

        res={
            "data" : data,
            "links": links,
        }

        return res
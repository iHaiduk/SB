View = require("../views/Home")
UserModel = require("../models/User")
Page = require("../models/Page")

class HomeController
  home: null
  defaultPage: 3
  pages: null
  run: (req, res)->
    v = new View(res, 'index')
    defaultPage = HomeController::defaultPage
    Page.findOne({page_id: defaultPage}).exec (err, pages)->
      unless pages?
        HomeController::pages = pages
        baseText = [
          param: "text"
          code: """<p><sup>Hello to Documentation page!</sup></p><p>This is your first page.</p>"""
        ]
        page = new Page(
          page_id: defaultPage
          code: JSON.stringify baseText
        );
        page.save((err)->
          v.render(
            html: baseText
          )
          return
        )
        return
      else
        v.render(
          html: JSON.parse pages.code
        )
        return
    return

  save: (req, res) ->
    if req.body? and req.body.code?
      v = new View(res)
      defaultPage = HomeController::defaultPage
      Page.findOne { page_id: defaultPage }, (err, page) ->
        page.code = req.body.code
        page.save (err) ->
          v.send answ: true
          return
        return
    return

  cancel: (req, res) ->
    defaultPage = HomeController::defaultPage
    Page.findOne({page_id: defaultPage}).exec (err, pages)->
      if pages?
        v = new View(res, '../_includes/sectionGenerate')
        v.getHtml(
          html: JSON.parse pages.code
        )
        return
    return

module.exports = HomeController
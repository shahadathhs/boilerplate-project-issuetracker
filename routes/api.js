'use strict';

const issues = {};
let currentId = 1;

module.exports = function (app) {

  app.route('/api/issues/:project')
    // GET request to view issues with or without filters
    .get(function (req, res) {
      const project = req.params.project;
      const filter = req.query;

      if (!issues[project]) {
        return res.json([]);
      }

      let result = issues[project];

      // Apply filters
      for (const key in filter) {
        if (filter.hasOwnProperty(key)) {
          result = result.filter(issue => issue[key] === filter[key]);
        }
      }

      res.json(result);
    })
    
    // POST request to create a new issue
    .post(function (req, res) {
      const project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      // Validate required fields
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      const newIssue = {
        _id: currentId++,
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        open: true
      };

      if (!issues[project]) {
        issues[project] = [];
      }

      issues[project].push(newIssue);

      res.json(newIssue);
    })
    
    // PUT request to update an existing issue
    .put(function (req, res) {
      const project = req.params.project;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
    
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
    
      if (!issues[project]) {
        return res.json({ error: 'project not found' });
      }
    
      const issue = issues[project].find(issue => issue._id == _id);
    
      if (!issue) {
        return res.json({ error: 'could not update', _id });
      }
    
      // No fields to update
      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && typeof open === 'undefined') {
        return res.json({ error: 'no update field(s) sent', _id });
      }
    
      // Update fields
      issue.issue_title = issue_title || issue.issue_title;
      issue.issue_text = issue_text || issue.issue_text;
      issue.created_by = created_by || issue.created_by;
      issue.assigned_to = assigned_to || issue.assigned_to;
      issue.status_text = status_text || issue.status_text;
      if (typeof open !== 'undefined') {
        issue.open = open;
      }
      issue.updated_on = new Date().toISOString();
    
      res.json({ result: 'successfully updated', _id });
    })    
    
    // DELETE request to delete an issue
    .delete(function (req, res) {
      const project = req.params.project;
      const { _id } = req.body;
    
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
    
      if (!issues[project]) {
        return res.json({ error: 'project not found' });
      }
    
      const index = issues[project].findIndex(issue => issue._id == _id);
    
      if (index === -1) {
        return res.json({ error: 'could not delete', _id });
      }
    
      issues[project].splice(index, 1);
    
      res.json({ result: 'successfully deleted', _id });
    });
};

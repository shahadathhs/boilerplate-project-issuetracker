const Issue = require('../models/Issue');

module.exports = function (app) {
  app.route('/api/issues/:project')
    // GET request to view issues on a project with optional filters
    .get(async function (req, res) {
      const project = req.params.project;
      const filter = { ...req.query, project };

      try {
        const issues = await Issue.find(filter).exec();
        res.json(issues);
      } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })

    // POST request to create an issue with every field
    .post(async function (req, res) { 
      const project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      const newIssue = new Issue({
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        project,
      });

      try {
        await newIssue.save();
        res.json(newIssue);
      } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })

    // PUT request to update one or multiple fields on an issue
    .put(async function (req, res) {
      const project = req.params.project;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      // Check if there are fields to update
      const updateFields = { issue_title, issue_text, created_by, assigned_to, status_text, open };

      // Remove fields with undefined values
      Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }

      try {
        const result = await Issue.findOneAndUpdate({ _id, project }, { ...updateFields, updated_on: new Date() }, { new: true });
        if (!result) {
          return res.json({ error: 'could not update', _id });
        }
        console.log(result);
        res.json({ result: 'successfully updated', _id });
      } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })

    // DELETE request to delete an issue
    .delete(async function (req, res) {
      const { _id } = req.body;
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      const issue = await Issue.find({_id});
      if (!issue) {
        return res.json({ error: 'could not delete', _id });
      }
      const result = await Issue.deleteOne({ _id });
      if (result.deletedCount === 0) {
        return res.json({ error: 'could not delete', _id });
      }
      res.json({ result: 'successfully deleted', _id });
    });
};

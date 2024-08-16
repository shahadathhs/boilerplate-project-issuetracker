const Issue = require("../models/Issue");

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    // GET request to view issues on a project with optional filters
      .get(async function (req, res) {
        const project = req.params.project;
        const filter = { project, ...req.query };
  
        // Convert string 'true' and 'false' to boolean values
        Object.keys(filter).forEach((key) => {
          if (filter[key] === "true") filter[key] = true;
          if (filter[key] === "false") filter[key] = false;
        });
  
        const issues = await Issue.find(filter);
        console.log(issues);
        res.json(issues);
    })

    // POST request to create an issue with every field
    .post(async function (req, res) {
      const project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }

      const newIssue = new Issue({
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        project,
      });

      await newIssue.save();
      res.json(newIssue);
    })

    // PUT request to update one or multiple fields on an issue
    .put(async function (req, res) {
      const { _id, ...updateFields } = req.body;

      if (!_id) return res.json({ error: "missing _id" });
      if (Object.keys(updateFields).length === 0)
        return res.json({ error: "no update field(s) sent", _id: _id });

      const issue = await Issue.findOne({ _id });
      if (!issue) {
        return res.json({ error: "could not update", "_id": _id });
      }

      const result = await Issue.updateOne(
        { _id },
        { $set: updateFields, $currentDate: { updated_on: new Date().toISOString() } }
      );
      if (result.modifiedCount === 0) {
        return res.json({ error: "could not update", "_id": _id });
      }

      res.json({ result: "successfully updated", "_id": _id });
    })

    // DELETE request to delete an issue
    .delete(async function (req, res) {
      const { _id } = req.body;
      if (!_id) {
        return res.json({ error: "missing _id" });
      }
      const issue = await Issue.find({ _id });
      if (!issue) {
        return res.json({ error: "could not delete", _id });
      }
      const result = await Issue.deleteOne({ _id });
      if (result.deletedCount === 0) {
        return res.json({ error: "could not delete", _id });
      }
      res.json({ result: "successfully deleted", _id });
    });
};

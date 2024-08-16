const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { suite } = require("mocha");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  
  suite("POST /api/issues/{project}", function () {
    // #1: Create an issue with every field
    test("Create an issue with every field", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .post("/api/issues/test")
        .send({
          issue_title: "Test Issue Full",
          issue_text: "Test Text Full",
          created_by: "Test User Full",
          assigned_to: "Test Assignee",
          status_text: "In Progress",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Test Issue Full");
          assert.equal(res.body.issue_text, "Test Text Full");
          assert.equal(res.body.created_by, "Test User Full");
          assert.equal(res.body.assigned_to, "Test Assignee");
          assert.equal(res.body.status_text, "In Progress");
          assert.equal(res.body.open, true);
          assert.isNumber(res.body._id);
          done();
        });
    });

    // #2: Create an issue with only required fields
    test("Create an issue with only required fields", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .post("/api/issues/test")
        .send({
          issue_title: "Test Issue Required",
          issue_text: "Test Text Required",
          created_by: "Test User Required",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Test Issue Required");
          assert.equal(res.body.issue_text, "Test Text Required");
          assert.equal(res.body.created_by, "Test User Required");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.open, true);
          assert.isNumber(res.body._id);
          done();
        });
    });

    // #3: Create an issue with missing required fields
    test("Create an issue with missing required fields", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .post("/api/issues/test")
        .send({
          issue_title: "Test Issue Missing Fields",
          // Missing issue_text and created_by
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  suite("GET /api/issues/{project}", function () {
    // #4: View issues on a project
    test("View issues on a project", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .get("/api/issues/test")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    // #5: View issues on a project with one filter
    test("View issues on a project with one filter", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .get("/api/issues/test?open=true")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    // #6: View issues on a project with multiple filters
    test("View issues on a project with multiple filters", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .get("/api/issues/test?open=true&created_by=Test User")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });
  });

  suite("PUT /api/issues/{project}", function () {
    // #7: Update one field on an issue
    test("Update one field on an issue", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .put("/api/issues/test")
        .send({
          _id: 1,
          issue_title: "Test Issue Updated",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          done();
        });
    });

    // #8: Update multiple fields on an issue
    test("Update multiple fields on an issue", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .put("/api/issues/test")
        .send({
          _id: 1,
          issue_title: "Test Issue Updated",
          issue_text: "Test Text Updated",
          created_by: "Test User Updated",
          assigned_to: "Test Assignee Updated",
          status_text: "In Progress Updated",
          open: false,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          done();
        });
    });

    // #9: Update an issue with missing _id
    test("Update an issue with missing _id", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .put("/api/issues/test")
        .send({
          issue_title: "Test Issue Missing _id",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });

    // #10: Update an issue with no fields to update
    test("Update an issue with no fields to update", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .put("/api/issues/test")
        .send({
          _id: 1,
          // No fields to update
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          done();
        });
    });

    // #11: Update an issue with an invalid _id
    test("Update an issue with an invalid _id", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .put("/api/issues/test")
        .send({
          _id: "invalid_id",
          issue_title: "Test Issue Invalid _id",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          done();
        });
    });
  });

  suite("DELETE /api/issues/{project}", function () {
    // #12: Delete an issue
    test("Delete an issue", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .delete("/api/issues/test")
        .send({
          _id: 1,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
          done();
        });
    });

    // #13: Delete an issue with an invalid _id
    test("Delete an issue with an invalid _id", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .delete("/api/issues/test")
        .send({
          _id: "invalid_id",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");
          done();
        });
    });

    // #14: Delete an issue with missing _id
    test("Delete an issue with missing _id", function (done) {
      chai
        .request(server)
        .keepOpen(true)
        .delete("/api/issues/test")
        .send({
          // Missing _id
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
  });
});

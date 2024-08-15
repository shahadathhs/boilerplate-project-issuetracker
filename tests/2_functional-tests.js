const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("GET /api/issues/{project}", function () {
    // #1
    test("View issues on a project", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    // #2
    test("View issues on a project with one filter", function (done) {
      chai
        .request(server)
        .get("/api/issues/test?open=true")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    // #3
    test("View issues on a project with multiple filters", function (done) {
      chai
        .request(server)
        .get("/api/issues/test?open=true&created_by=Test User")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });
  });

  // suite("POST /api/issues/{project}", function () {
  //   // #4
  //   test("Create an issue", function (done) {
  //     chai
  //       .request(server)
  //       .post("/api/issues/test")
  //       .send({
  //         issue_title: "Test Issue",
  //         issue_text: "Test Text",
  //         created_by: "Test User",
  //       })
  //       .end(function (err, res) {
  //         assert.equal(res.status, 200);
  //         assert.equal(res.body.issue_title, "Test Issue");
  //         assert.equal(res.body.issue_text, "Test Text");
  //         assert.equal(res.body.created_by, "Test User");
  //         assert.equal(res.body.assigned_to, "");
  //         assert.equal(res.body.status_text, "");
  //         assert.equal(res.body.open, true);
  //         assert.isNumber(res.body._id);
  //         done();
  //       });
  //   });
  // });
});

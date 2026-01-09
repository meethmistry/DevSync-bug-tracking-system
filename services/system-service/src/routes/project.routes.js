const express = require("express");
const router = express.Router();
const { tokenAuth } = require("../../../../shared/middlewares/auth.middleware");
const technologyController = require("../controllers/project/technology.controller");
const databaseController = require("../controllers/project/database.controller");
const industryController = require("../controllers/project/industry.controller");
const programmingLanguageController = require("../controllers/project/programmingLanguage.controller");
const projectTypeController = require("../controllers/project/projectType.controller");


////////////////////////////////////////////////////////////////////////
////////////////// Project Technologies Routes /////////////////////////
////////////////////////////////////////////////////////////////////////
router.post("/technologies", tokenAuth, technologyController.createTechnology);
router.get("/technologies", tokenAuth, technologyController.getAllTechnologies);
router.post("/technologies/:id", tokenAuth, technologyController.updateTechnology);
router.delete("/technologies/:id", tokenAuth, technologyController.deactivateTechnology);


////////////////////////////////////////////////////////////////////////
////////////////// Databse Routes //////////////////////////////////////
////////////////////////////////////////////////////////////////////////
router.post("/databases", tokenAuth, databaseController.createDatabase);
router.get("/databases", tokenAuth, databaseController.getAllDatabases);
router.post("/databases/:id", tokenAuth, databaseController.updateDatabase);
router.delete("/databases/:id", tokenAuth, databaseController.deactivateDatabase);


////////////////////////////////////////////////////////////////////////
////////////////// Industries Routes //////////////////////////////////
////////////////////////////////////////////////////////////////////////
router.post("/industries", tokenAuth, industryController.createIndustry);
router.get("/industries", tokenAuth, industryController.getAllIndustries);
router.post("/industries/:id", tokenAuth, industryController.updateIndustry);
router.delete("/industries/:id", tokenAuth, industryController.deactivateIndustry);


////////////////////////////////////////////////////////////////////////
////////////////// Programming Languages Routes ////////////////////////
////////////////////////////////////////////////////////////////////////
router.post("/languages", tokenAuth, programmingLanguageController.createProgrammingLanguage);
router.get("/languages", tokenAuth, programmingLanguageController.getAllProgrammingLanguages);
router.post("/languages/:id", tokenAuth, programmingLanguageController.updateProgrammingLanguage);
router.delete("/languages/:id", tokenAuth, programmingLanguageController.deactivateProgrammingLanguage);


////////////////////////////////////////////////////////////////////////
//////////////////////// Project Types Routes //////////////////////////
////////////////////////////////////////////////////////////////////////
router.post("/project-types", tokenAuth, projectTypeController.createProjectType);
router.get("/project-types", tokenAuth, projectTypeController.getAllProjectTypes);
router.post("/project-types/:id", tokenAuth, projectTypeController.updateProjectType);
router.delete("/project-types/:id", tokenAuth, projectTypeController.deactivateProjectType);


module.exports = router;

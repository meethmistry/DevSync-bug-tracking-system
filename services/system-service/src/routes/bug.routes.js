const express = require("express");
const router = express.Router();
const { tokenAuth } = require("../../../../shared/middlewares/auth.middleware");
const bugTypeController = require("../controllers/bug/bug.type.controller");
const bugSeverityController = require("../controllers/bug/bug.severity.controller");
const bugPriorityController = require("../controllers/bug/bug.priority.controller");
const bugStatusController = require("../controllers/bug/bug.status.controller");


////////////////////////////////////////////////////////////////////////
/////////////////////////// Bug Types Routes ///////////////////////////
////////////////////////////////////////////////////////////////////////
router.post("/bug-types", tokenAuth, bugTypeController.createBugType);
router.get("/bug-types", tokenAuth, bugTypeController.getAllBugTypes);
router.post("/bug-types/:id", tokenAuth, bugTypeController.updateBugType);
router.delete("/bug-types/:id", tokenAuth, bugTypeController.deactivateBugType);

////////////////////////////////////////////////////////////////////////
//////////////////////// Bug Severities Routes //////////////////////////
////////////////////////////////////////////////////////////////////////
router.post("/bug-severities", tokenAuth, bugSeverityController.createBugSeverity);
router.get("/bug-severities", tokenAuth, bugSeverityController.getAllBugSeverities);
router.post("/bug-severities/:id", tokenAuth, bugSeverityController.updateBugSeverity);
router.delete("/bug-severities/:id", tokenAuth, bugSeverityController.deactivateBugSeverity);

////////////////////////////////////////////////////////////////////////
//////////////////////// Bug Priorities Routes //////////////////////////   
////////////////////////////////////////////////////////////////////////
router.post("/bug-priorities", tokenAuth, bugPriorityController.createBugPriority);
router.get("/bug-priorities", tokenAuth, bugPriorityController.getAllBugPriorities);
router.post("/bug-priorities/:id", tokenAuth, bugPriorityController.updateBugPriority);
router.delete("/bug-priorities/:id", tokenAuth, bugPriorityController.deactivateBugPriority);   

////////////////////////////////////////////////////////////////////////
//////////////////////// Bug Status Routes ////////////////////////////
////////////////////////////////////////////////////////////////////////    
router.post("/bug-statuses", tokenAuth, bugStatusController.createBugStatus);
router.get("/bug-statuses", tokenAuth, bugStatusController.getAllBugStatuses);
router.post("/bug-statuses/:id", tokenAuth, bugStatusController.updateBugStatus);
router.delete("/bug-statuses/:id", tokenAuth, bugStatusController.deactivateBugStatus);


module.exports = router;

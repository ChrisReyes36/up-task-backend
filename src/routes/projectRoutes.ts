import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { projectExists } from "../middlewares/project";
import { taskBelongsToProject, taskExists } from "../middlewares/task";
import ProjectController from "../controllers/ProjectController";
import TaskController from "../controllers/TaskController";
import { authenticate } from "../middlewares/auth";
import TeamMemberController from "../controllers/TeamController";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  [
    body("projectName")
      .notEmpty()
      .withMessage("El nombre del proyecto es obligatorio"),
    body("clientName")
      .notEmpty()
      .withMessage("El nombre del cliente es obligatorio"),
    body("description")
      .notEmpty()
      .withMessage("La descripción del proyecto es obligatoria"),
    handleInputErrors,
  ],
  ProjectController.createProject,
);
router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("ID no válido"), handleInputErrors],
  ProjectController.getProjectById,
);

router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("ID no válido"),
    body("projectName")
      .notEmpty()
      .withMessage("El nombre del proyecto es obligatorio"),
    body("clientName")
      .notEmpty()
      .withMessage("El nombre del cliente es obligatorio"),
    body("description")
      .notEmpty()
      .withMessage("La descripción del proyecto es obligatoria"),
    handleInputErrors,
  ],
  ProjectController.updateProject,
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("ID no válido"), handleInputErrors],
  ProjectController.deleteProject,
);

/** Routes for tasks */
router.param("projectId", projectExists);

router.post(
  "/:projectId/tasks",
  [
    param("projectId").isMongoId().withMessage("ID proyecto no válido"),
    body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body("description")
      .notEmpty()
      .withMessage("La descripción de la es obligatoria"),
    handleInputErrors,
  ],
  TaskController.createTask,
);

router.get(
  "/:projectId/tasks",
  [param("projectId").isMongoId().withMessage("ID proyecto no válido")],
  TaskController.getProjectTasks,
);

router.param("taskId", taskExists);
router.param("taskId", taskBelongsToProject);

router.get(
  "/:projectId/tasks/:taskId",
  [
    param("projectId").isMongoId().withMessage("ID proyecto no válido"),
    param("taskId").isMongoId().withMessage("ID tarea no válido"),
    handleInputErrors,
  ],
  TaskController.getTaskById,
);

router.put(
  "/:projectId/tasks/:taskId",
  [
    param("projectId").isMongoId().withMessage("ID proyecto no válido"),
    param("taskId").isMongoId().withMessage("ID tarea no válido"),
    body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body("description")
      .notEmpty()
      .withMessage("La descripción de la es obligatoria"),
    handleInputErrors,
  ],
  TaskController.updateTask,
);

router.delete(
  "/:projectId/tasks/:taskId",
  [
    param("projectId").isMongoId().withMessage("ID proyecto no válido"),
    param("taskId").isMongoId().withMessage("ID tarea no válido"),
    handleInputErrors,
  ],
  TaskController.deleteTask,
);

router.patch(
  "/:projectId/tasks/:taskId/status",
  [
    param("projectId").isMongoId().withMessage("ID proyecto no válido"),
    param("taskId").isMongoId().withMessage("ID tarea no válido"),
    body("status")
      .notEmpty()
      .withMessage("El estado de la tarea es obligatorio"),
    handleInputErrors,
  ],
  TaskController.updateStatus,
);

/** Routes for teams */
router.post(
  "/:projectId/team/find",
  [
    body("email").isEmail().toLowerCase().withMessage("E-mail no válido"),
    handleInputErrors,
  ],
  TeamMemberController.findMemberByEmail,
);

router.get("/:projectId/team", TeamMemberController.getProjectTeam);

router.post(
  "/:projectId/team",
  [body("id").isMongoId().withMessage("ID no válido"), handleInputErrors],
  TeamMemberController.addMemberById,
);

router.delete(
  "/:projectId/team",
  [body("id").isMongoId().withMessage("ID no válido"), handleInputErrors],
  TeamMemberController.removeMemberById,
);

export default router;

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import meRouter from "./me";
import mandateRouter from "./mandate";
import taxonomyRouter from "./taxonomy";
import statsRouter from "./stats";
import demandsRouter from "./demands";
import adminRouter from "./admin";
import projectsRouter from "./projects";
import newsRouter from "./news";
import agendaRouter from "./agenda";
import appointmentsRouter from "./appointments";
import slotsRouter from "./slots";
import crmRouter from "./crm";
import aiRouter from "./ai";
import teamRouter from "./team";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(meRouter);
router.use(mandateRouter);
router.use(taxonomyRouter);
router.use(statsRouter);
router.use(demandsRouter);
router.use(adminRouter);
router.use(projectsRouter);
router.use(newsRouter);
router.use(agendaRouter);
router.use(appointmentsRouter);
router.use(slotsRouter);
router.use(crmRouter);
router.use(aiRouter);
router.use(teamRouter);

export default router;

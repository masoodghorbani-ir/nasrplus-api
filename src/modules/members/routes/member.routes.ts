import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';

const router = Router();
const memberController = new MemberController();

// Member resource routes
router.get('/', memberController.getMembers);
router.post('/', memberController.createMember);
router.get('/:id', memberController.getMemberById);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

export const memberRoutes = router;

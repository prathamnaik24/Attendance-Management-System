import { OrgStructureService } from '../../services/admin/OrgStructureService.js';

export const getDepartments = async (req, res) => {
  try {
    const departments = await OrgStructureService.getDepartments(req.user.org_id);
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPositionsTree = async (req, res) => {
  try {
    const tree = await OrgStructureService.getPositionsTree(req.user.org_id);
    res.json(tree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

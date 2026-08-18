import { RoleService } from '../../services/admin/RoleService.js';

export const getRoles = async (req, res) => {
  try {
    const roles = await RoleService.getRoles(req.user.org_id);
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPermissions = async (req, res) => {
  try {
    const permissions = await RoleService.getPermissions();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assignPermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissionIds } = req.body;
    await RoleService.assignPermissions(roleId, permissionIds);
    res.json({ message: 'Permissions assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

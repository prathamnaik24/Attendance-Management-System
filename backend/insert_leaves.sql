DO $$
DECLARE
  org record;
  l_type json;
  l_id uuid;
  leaves json := '[
    {"name": "Annual Leave", "days": 10},
    {"name": "Sick Leave", "days": 7},
    {"name": "Casual Leave", "days": 5},
    {"name": "Emergency Leave", "days": 3}
  ]';
BEGIN
  FOR org IN SELECT id FROM organizations LOOP
    FOR l_type IN SELECT * FROM json_array_elements(leaves) LOOP
      INSERT INTO leave_types (organization_id, name, is_paid, is_active)
      VALUES (org.id, l_type->>'name', true, true)
      ON CONFLICT DO NOTHING;
      
      SELECT id INTO l_id FROM leave_types WHERE organization_id = org.id AND name = l_type->>'name';
      
      INSERT INTO leave_policies (leave_type_id, days_allowed, carry_forward_allowed)
      VALUES (l_id, (l_type->>'days')::numeric, false)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

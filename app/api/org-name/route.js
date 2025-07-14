// /app/api/org-name/route.js

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // For AWS RDS; set to true with proper certs in prod
  },
});

export async function GET() {
  try {
    const result = await pool.query('SELECT name FROM organizations LIMIT 1');
    const orgName = result.rows[0]?.name || 'Organizations';
    return new Response(JSON.stringify({ orgName }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
export async function POST(request) {
  try {
    const { orgName } = await request.json();
    // Make sure to update your query as needed
    await pool.query('UPDATE organizations SET name = $1 WHERE id = 1', [orgName]); // Adjust condition if necessary
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

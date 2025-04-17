import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, CartesianGrid
} from 'recharts';

const ImpactDistribution = ({ impactProjects = [] }) => {
  const [activeGraph, setActiveGraph] = useState("area");
  
  // Calculate total impact hours
  const totalImpact = {
    hours: impactProjects.reduce((sum, project) => sum + project.hours, 0)
  };
  
  // Data preparation for impact area chart
  const impactAreaData = ['Environmental', 'Educational', 'Humanitarian', 'Health', 'Cultural']
    .map(area => {
      const areaProjects = impactProjects.filter(p => p.impact === area);
      const areaHours = areaProjects.reduce((sum, p) => sum + p.hours, 0);
      return {
        name: area,
        value: areaHours,
        percentage: Math.round((areaHours / (totalImpact.hours || 1)) * 100)
      };
    })
    .filter(area => area.value > 0);
  
  // Data preparation for status chart
  const statusData = ['Planned', 'In Progress', 'Completed', 'On Hold']
    .map(status => {
      const count = impactProjects.filter(p => p.status === status).length;
      return {
        name: status,
        count,
        percentage: Math.round((count / (impactProjects.length || 1)) * 100)
      };
    });
  
  // Data preparation for timeline chart
  const timelineData = generateTimelineData(impactProjects);

  // Colors for charts
  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="w-full md:w-2/3 p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">Impact Distribution</h4>
        <select
          className="bg-gray-900 p-1 rounded focus:ring-1 focus:ring-green-500 transition-all"
          onChange={(e) => setActiveGraph(e.target.value)}
          defaultValue="area"
        >
          <option value="area">By Impact Area</option>
          <option value="status">By Project Status</option>
          <option value="time">Timeline View</option>
        </select>
      </div>
      
      <div className="h-64 w-full">
        {impactProjects.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available
          </div>
        ) : activeGraph === "area" ? (
          <div className="flex h-full w-full">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impactAreaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    labelLine={false}
                  >
                    {impactAreaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [`${value} hours`, name]}
                    contentStyle={{ backgroundColor: '#181818', borderColor: '#333' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactAreaData.slice(0, 3)}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#bbb', fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value) => [`${value} hours`, 'Hours']}
                    contentStyle={{ backgroundColor: '#181818', borderColor: '#333' }}
                  />
                  <Bar dataKey="value" fill="#10B981">
                    {impactAreaData.slice(0, 3).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : activeGraph === "status" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" tick={{ fill: '#bbb', fontSize: 12 }} />
              <YAxis tick={{ fill: '#bbb' }} />
              <Tooltip 
                formatter={(value) => [value, 'Projects']}
                contentStyle={{ backgroundColor: '#181818', borderColor: '#333' }}
              />
              <Bar dataKey="count">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#bbb' }}
                tickFormatter={(value) => value.substring(0, 3)}
              />
              <YAxis tick={{ fill: '#bbb' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#181818', borderColor: '#333' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="active" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

// Helper function to generate timeline data
function generateTimelineData(projects) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return months.map(month => {
    // In a real app, you would use actual date data from projects
    return {
      month,
      active: Math.floor(Math.random() * 10),
      completed: Math.floor(Math.random() * 8)
    };
  });
}

export default ImpactDistribution;
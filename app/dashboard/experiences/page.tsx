"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  responsibilities: string[]
  createdAt: string
  updatedAt: string
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    responsibilities: "",
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    const res = await fetch("/api/experiences")
    const data = await res.json()
    setExperiences(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const experienceData = {
      ...formData,
      responsibilities: formData.responsibilities.split('\n').filter(r => r.trim()),
      ...(editingId && { id: editingId }),
    }

    const url = "/api/experiences"
    const method = editingId ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(experienceData),
    })

    if (res.ok) {
      fetchExperiences()
      resetForm()
    }
  }

  const handleEdit = (experience: Experience) => {
    setFormData({
      title: experience.title,
      company: experience.company,
      location: experience.location,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      description: experience.description,
      responsibilities: experience.responsibilities.join('\n'),
    })
    setEditingId(experience.id)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/experiences?id=${id}`, { method: "DELETE" })
    if (res.ok) {
      fetchExperiences()
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      responsibilities: "",
    })
    setEditingId(null)
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Present"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Experiences</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add and manage your work experience
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {editingId ? "Edit Experience" : "Add New Experience"}
              </CardTitle>
              <CardDescription>
                {editingId ? "Update experience details" : "Fill in the experience details below"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Cybersecurity Intern"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. CFSS Cyber and Forensics"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bangalore, India"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="month"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="month"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={formData.current}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="current"
                    checked={formData.current}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, current: checked as boolean, endDate: checked ? "" : formData.endDate })
                    }
                  />
                  <Label htmlFor="current" className="cursor-pointer">
                    I currently work here
                  </Label>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the role..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="responsibilities">
                    Key Responsibilities (one per line) *
                  </Label>
                  <Textarea
                    id="responsibilities"
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    placeholder="Performed vulnerability testing&#10;Practiced ethical hacking&#10;Gained hands-on experience"
                    rows={5}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    {editingId ? "Update Experience" : "Add Experience"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Experiences ({experiences.length})</CardTitle>
                <CardDescription>Latest experiences appear first</CardDescription>
              </CardHeader>
            </Card>

            {experiences.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No experiences yet. Add your first experience!</p>
                </CardContent>
              </Card>
            ) : (
              experiences.map((experience) => (
                <Card key={experience.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{experience.title}</h3>
                          {experience.current && (
                            <Badge variant="default" className="text-xs">Current</Badge>
                          )}
                        </div>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          {experience.company}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {experience.location}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(experience.startDate)} - {experience.current ? "Present" : formatDate(experience.endDate)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(experience)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(experience.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {experience.description}
                    </p>

                    <div className="space-y-1">
                      {experience.responsibilities.map((resp, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
  )
}

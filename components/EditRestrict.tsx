import type { Page } from '@/types/Page'
import { useState } from 'react'

import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Field, FieldGroup, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from './ui/input-group'
import { Label } from './ui/label'

interface EditRestrictProps {
  page: Page
  onEdit: (page: Page, editedPage: Page) => void
}

const EditRestrict = ({ page, onEdit }: EditRestrictProps) => {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState(page.url.replace('https://', ''))
  const [name, setName] = useState(page.name)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onEdit(page, { name, url: 'https://' + url })

    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p>Edit</p>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Restricted Website</DialogTitle>
            <DialogDescription>
              Edit this restricted website to match your need
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="url">URL</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="col-span-3"
                  placeholder="example.com/*"
                  required
                />
                <InputGroupAddon>
                  <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditRestrict

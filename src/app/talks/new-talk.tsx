"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Combobox } from "~/components/combobox";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { createTag } from "./actions";
import { talkSchema } from "./schema";

const CURRENT_YEAR = new Date(Date.now()).getFullYear();

function NewTalkDialog({
  tags,
  speakers,
}: {
  tags: { id: string; name: string }[];
  speakers: { label: string; value: string }[];
}) {
  const tagOption = tags.map(({ name }) => ({ label: name, value: name }));
  console.log(tags);
  const form = useForm<z.infer<typeof talkSchema>>({
    resolver: zodResolver(talkSchema),
    defaultValues: {
      description: "",
      length: 0,
      speakerIds: [],
      tags: [],
      title: "",
      videoUrl: "",
      year: CURRENT_YEAR,
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Talk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share a Talk</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => console.log(values))}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Title*</FormLabel>
                  <FormControl className="col-span-3">
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Description</FormLabel>
                  <FormControl className="col-span-3">
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Video URL*</FormLabel>
                  <FormControl className="col-span-3">
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="mt-1 text-right">
                    Length*
                    <FormDescription className="mt-1">
                      In Minutes
                    </FormDescription>
                  </FormLabel>
                  <FormControl className="col-span-3">
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Year*</FormLabel>
                  <FormControl className="col-span-3">
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Tags</FormLabel>
                  <FormControl className="col-span-3">
                    <Combobox
                      options={tagOption}
                      selected={field.value}
                      mode="multiple"
                      onChange={field.onChange}
                      placeholder="Pick or create relevant tags"
                      onCreate={createTag}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="speakerIds"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Speakers*</FormLabel>
                  <FormControl className="col-span-3">
                    <Combobox
                      options={speakers}
                      selected={field.value.map((sp) => sp[0])}
                      mode="multiple"
                      onChange={field.onChange}
                      placeholder="Pick or create relevant tags"
                      onCreate={(val) => {
                        form.setValue("speakerIds", [
                          ...form.getValues("speakerIds"),
                          [val, val],
                        ]);
                        speakers.push({ label: val, value: val });
                      }}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default NewTalkDialog;

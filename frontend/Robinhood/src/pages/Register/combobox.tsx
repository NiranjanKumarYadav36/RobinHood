import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "../../lib/utils"
// import { toast } from "@/components/hooks/use-toast" // Removed this line
import { Button } from "../../components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"


interface ComboboxFormProps {
  title: string;
}

export default function ComboboxForm(props: ComboboxFormProps) {

    const languages = [
        { label: `English`, value: `en` },
        { label: `French`, value: `fr` },
        { label: `German`, value: `de` },
        { label: `Spanish`, value: `es` },
        { label: `Portuguese`, value: `pt` },
        { label: `Russian`, value: `ru` },
        { label: `Japanese`, value: `ja` },
        { label: `Korean`, value: `ko` },
        { label: `Chinese`, value: `zh` },
      ] as const
      
      const FormSchema = z.object({
        language: z.string({
          required_error: `Please select a ${props.title}.`,
        }),
      })


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("You submitted the following values:", data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1">
              <FormLabel className="text-white">{props.title}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[178px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                        : `Select ${props.title}`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder={`Search ${props.title} ...`} />
                    <CommandList>
                      <CommandEmpty>No {props.title}s found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue("language", language.value)
                            }}
                          >
                            {language.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                language.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {/* <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription> */}
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        {/* <Button type="submit">Submit</Button> */}
      </form>
    </Form>
  )
}
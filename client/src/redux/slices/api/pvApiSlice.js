import { apiSlice } from "../apiSlice";

export const pvApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Créer un PV
    createPV: builder.mutation({
      query: ({ data, taskId }) => ({
        url: `/pv/task/${taskId}`,
        method: "POST",
        body: { data },
      }),
      invalidatesTags: ["Task", "PV"],
    }),
    
    // Récupérer tous les PVs d'une tâche
    getPVsByTask: builder.query({
      query: (taskId) => `/pv/task/${taskId}`,
      providesTags: ["PV"],
    }),
    
    // Récupérer un PV spécifique
    getPVById: builder.query({
      query: (id) => `/pv/${id}`,
      providesTags: ["PV"],
    }),
    
    // Mettre à jour un PV
    updatePV: builder.mutation({
      query: ({ id, data }) => ({
        url: `/pv/${id}`,
        method: "PUT",
        body: { data },
      }),
      invalidatesTags: ["PV", "Task"],
    }),
    
    // Marquer un PV comme complété ou non
    completePV: builder.mutation({
      query: ({ id, isCompleted }) => ({
        url: `/pv/${id}/complete`,
        method: "PATCH",
        body: { isCompleted },
      }),
      invalidatesTags: ["PV", "Task"],
    }),

    deletePV: builder.mutation({
      query: (id) => ({
        url: `/pv/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task', 'PV'],
    }),
  }),
});

export const {
  useCreatePVMutation,
  useGetPVsByTaskQuery,
  useGetPVByIdQuery,
  useUpdatePVMutation,
  useCompletePVMutation,
  useDeletePVMutation,
} = pvApiSlice;